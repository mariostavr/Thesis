# ======================================================================#
#                           HUMMINGBOT SERVICES                         #
# ======================================================================#

# > Modules and Dependecies
import docker
import yaml
import tarfile
import io
import time
from ruamel.yaml import YAML
from typing import Dict
import encryption

# > Docker Client
docker_client = docker.from_env()

# Global
conf_path: str = '/home/hummingbot/conf'
conf_file_path = '/home/hummingbot/conf/conf_client.yml'
pass_verification = '.password_verification'
strategies_path: str = '/home/hummingbot/conf/strategies'
connectors_path: str = '/home/hummingbot/conf/connectors/'

# ----------------------------------------> Hummingbot Instance
# > Create Hummingbot Instance
async def create_hummingbot_instance(container_name: str, or_password: str, killswitch: float):
    container = docker_client.containers.create(
        name=container_name,
        image="hummingbot/hummingbot:development",
        environment={
            "CONFIG_PASSWORD": or_password
        },
        volumes={
            "hbot-data": {"bind": "/data"},
            "hbot-conf": {"bind": "/conf"},
            "hbot-connectors-global": {"bind": "/conf/connectors"},
            "hbot-strategies-global": {"bind": "/conf/strategies"},
            "hbot-logs": {"bind": "/logs"},
            "hbot-scripts-global": {"bind": "/scripts"},
            "hbot-pmmscripts": {"bind": "/pmm_scripts"},
            "hbot-gateway-certs": {"bind": "/home/hummingbot/certs"}
        },
        tty=True,
        stdin_open=True,
        network_mode="host",
    )
    secrets_manager = encryption.ETHKeyFileSecretManger(or_password)
    encrypted_password = encryption.generate(secrets_manager)

    create_password_verification_file(container_name, encrypted_password)
    await modify_conf(container_name, killswitch)


# > Create Password Verification
def create_password_verification_file(container_name: str, instance_pass: str):
    try:
        docker_client = docker.from_env()
        container = docker_client.containers.get(container_name)

        tar_data = io.BytesIO()
        tar = tarfile.open(fileobj=tar_data, mode='w')
        tarinfo = tarfile.TarInfo(name=pass_verification)
        tarinfo.size = len(instance_pass)
        tar.addfile(tarinfo, io.BytesIO(instance_pass.encode('utf-8')))
        tar.close()
        tar_data.seek(0)

        container.put_archive(conf_path, tar_data.getvalue())
        return {'success': True, 'message': f'File "{pass_verification}" created successfully.'}
    except Exception as e:
        print(f"Error: {e}")
        return {'success': False, 'message': f'Error creating file "{pass_verification}".'}


# > Modify Conf File
async def modify_conf(container_name: str, killswitch: float):
    client = docker.from_env()
    container = client.containers.get(container_name)
    conf_file_path = f'{conf_path}/conf_client.yml'

    container.start()
    await wait_for_file_in_container(container_name, conf_file_path)

    conf_content = container.exec_run(
        f'cat {conf_file_path}').output.decode('utf-8')

    yaml = YAML()
    conf_dict = yaml.load(conf_content)

    conf_dict['mqtt_bridge']['mqtt_autostart'] = True
    conf_dict["kill_switch_mode"]["kill_switch_rate"] = killswitch

    modified_conf_content = io.StringIO()
    yaml.dump(conf_dict, modified_conf_content)

    modified_conf_bytes = modified_conf_content.getvalue().encode('utf-8')

    tar_bytes = io.BytesIO()
    tar = tarfile.TarFile(fileobj=tar_bytes, mode='w')
    tar_info = tarfile.TarInfo(name=conf_file_path[1:])
    tar_info.size = len(modified_conf_bytes)
    tar.addfile(tar_info, io.BytesIO(modified_conf_bytes))
    tar.close()
    tar_bytes.seek(0)

    container.put_archive('/', tar_bytes)
    container.stop()

# > Wait for Container Initialization
async def wait_for_file_in_container(container_name, file_path):
    while True:
        try:
            container = docker_client.containers.get(container_name)
            exec_result = container.exec_run(f"test -f {file_path}")
            if exec_result.exit_code == 0:
                return
        except Exception as e:
            pass
        time.sleep(1)


# > Create Strategy Configuration
async def create_strategy_file(container_name: str, strategy_config: Dict[str, str], file_name: str):
    if not file_name or not strategy_config:
        return {'success': False, 'message': 'File name and content are required.'}

    try:
        file_content = yaml.dump(strategy_config)

        docker_client = docker.from_env()
        container = docker_client.containers.get(container_name)

        tar_data = io.BytesIO()
        tar = tarfile.open(fileobj=tar_data, mode='w')
        tarinfo = tarfile.TarInfo(name=file_name)
        tarinfo.size = len(file_content)
        tar.addfile(tarinfo, io.BytesIO(file_content.encode()))
        tar.close()
        tar_data.seek(0)

        container.put_archive(strategies_path, tar_data.getvalue())
        return {'success': True, 'message': f'File "{file_name}" created successfully.'}

    except Exception as e:
        print(f"Error: {e}")
        return {'success': False, 'message': f'Error creating file "{file_name}".'}


# > Create Exchange Configuration
def create_exchange_config(container_name: str, exchange: Dict[str, str]):
    api_key = encryption.ETHKeyFileSecretManger(exchange.api_key)
    encrypted_apiKey = encryption.generate(api_key)
    exchange.api_key = encrypted_apiKey

    secret_api_key = encryption.ETHKeyFileSecretManger(exchange.secret_api_key)
    encrypted_apiSKey = encryption.generate(secret_api_key)
    exchange.secret_api_key = encrypted_apiSKey

    file_name = exchange.name + '.yml'
    try:
        exchange_config: Dict[str, str] = {
            "connector": exchange.name,
            "api_key": exchange.api_key,
            "api_secret_key": exchange.secret_api_key
        }

        file_content = yaml.dump(exchange_config)
        docker_client = docker.from_env()
        container = docker_client.containers.get(container_name)
        tar_data = io.BytesIO()
        tar = tarfile.open(fileobj=tar_data, mode='w')
        tarinfo = tarfile.TarInfo(name=file_name)
        tarinfo.size = len(file_content)
        tar.addfile(tarinfo, io.BytesIO(file_content.encode()))
        tar.close()
        tar_data.seek(0)

        container.put_archive(connectors_path, tar_data.getvalue())
        return {'success': True, 'message': f'File "{file_name}" created successfully.'}

    except Exception as e:
        print(f"Error: {e}")
        return {'success': False, 'message': f'Error creating file "{file_name}".'}

# > Get Hummingbot Instance ID
async def get_instance_id(container_name: str, container_path: str):
    container = docker_client.containers.get(container_name)
    conf = container.exec_run(f'cat {container_path}/conf_client.yml')
    conf_dict = yaml.safe_load(conf.output.decode('utf-8'))
    instance_id = conf_dict.get('instance_id', None)
    return {instance_id}


# > Status Hummingbot Instance
def status_hummingbot_instance(container_name: str):
    try:
        container = docker_client.containers.get(container_name)
        if container.status == "running":
            return "Active"
        else:
            return "Inactive"
    except docker.errors.NotFound:
        print(f"Container '{container_name}' not found.")


# > Start Hummingbot Instance
def start_hummingbot_instance(container_name: str):
    try:
        container = docker_client.containers.get(container_name)
        container.start()
        print(f"Container '{container_name}' started successfully.")
    except docker.errors.NotFound:
        print(f"Container '{container_name}' not found.")


# > Stop Hummingbot Instance
def stop_hummingbot_instance(container_name: str):
    try:
        container = docker_client.containers.get(container_name)
        container.stop()
        print(f"Container '{container_name}' stopped successfully.")
    except docker.errors.NotFound:
        print(f"Container '{container_name}' not found.")


# > Delete Hummingbot Instance
def delete_container(container_name: str):
    try:
        container = docker_client.containers.get(container_name)
        container.stop()
        container.remove()
        print(f"Container '{container_name}' deleted successfully.")
    except docker.errors.NotFound:
        print(f"Container '{container_name}' not found.")





# ----------------------------------------> EMQX Instance
# > Create Broker Instance
def create_broker_instance(user_id: int):
    docker_client = docker.from_env()

    container = docker_client.containers.create(
        name="emqx_"+str(user_id),
        image="emqx:5",
        restart_policy={"Name": "unless-stopped"},
        environment={
            "EMQX_NAME": "emqx",
            "EMQX_HOST": "node1.emqx.local",
            "EMQX_CLUSTER__DISCOVERY_STRATEGY": "static",
            "EMQX_CLUSTER__STATIC__SEEDS": "[emqx@node1.emqx.local]",
            "EMQX_LOADED_PLUGINS": "emqx_recon,emqx_retainer,emqx_management,emqx_dashboard"
        },
        volumes={
            "emqx-data": {"bind": "/opt/emqx/data"},
            "emqx-log": {"bind": "/opt/emqx/log"},
            "emqx-etc": {"bind": "/opt/emqx/etc"}
        },
        ports={
            "1883": "1883",   # mqtt:tcp
            "8883": "8883",   # mqtt:tcp:ssl
            "8083": "8083",   # mqtt:ws
            "8084": "8084",   # mqtt:ws:ssl
            "8081": "8081",   # http:management
            "18083": "18083",  # http:dashboard
        }
    )
    container.start()


def start_broker_instance(id: int):
    container_name = f"emqx_"+str(id)
    try:
        container = docker_client.containers.get(container_name)
        container.start()
        print(f"Container '{container_name}' started successfully.")
    except docker.errors.NotFound:
        print(f"Container '{container_name}' not found.")
    

def stop_broker_instance(id: int):
    container_name = f"emqx_"+str(id)
    try:
        container = docker_client.containers.get(container_name)
        container.stop()
        print(f"Container '{container_name}' stopped successfully.")
    except docker.errors.NotFound:
        print(f"Container '{container_name}' not found.")


#> Remove Exchange Configuration
# def remove_exchange_configuration(file_name: str, container_name: str):
#     try:
#         docker_client = docker.from_env()
#         container = docker_client.containers.get(container_name)
#         container.exec_run(f'rm {connectors_path}/{file_name}')
#         return {'success': True, 'message': f'File "{file_name}" deleted successfully.'}
#     except Exception as e:
#         print(f"Error: {e}")
#         return {'success': False, 'message': f'Error deleting file "{file_name}".'}
