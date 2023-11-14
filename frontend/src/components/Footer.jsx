/*======================================================================*/
/*				   	   		         FOOTER          							*/
/*======================================================================*/

//> Style
import "../styles/footer.css"

export default function Footer() {
   return (
      <footer>
         <div className="footer-bottom container text-center">
            <div>
               &copy; Copyright <strong><span>Coinrep</span></strong>.
            </div>
            <div className="logo">
               <a href="#home"><img src="assets/img/logo/logo.png" alt="logo" /></a>
            </div>
            <div className="py-3">
               <a href="mailto: contact@coinrep.com">Contact Us</a>
            </div>
         </div>
      </footer>
   );
}