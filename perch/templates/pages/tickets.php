<?php include($_SERVER['DOCUMENT_ROOT'].'/perch/runtime.php'); ?>
<?php perch_layout('global.header'); ?>

<?php 
	perch_content('Page Content'); 
?>

<div class="wrap">
	<div class="restrict narrow">
		<button id="checkout-button">Buy a Ticket €20</button>
		<script type="text/javascript">
		// Create an instance of the Stripe object with your publishable API key
		var stripe = Stripe(
			'pk_live_51ITOTYGc8mzhKHdom6HhbN4JxRmr4R3ndVK2HA8PU1dlD0rHn9Me4Sv9e31Kp0mCFhlxUP6o2a0rO8OiMEB3dz8Q00TdRSH1IZ'
		);
		var checkoutButton = document.getElementById('checkout-button');

	      checkoutButton.addEventListener('click', function() {
	        // Create a new Checkout Session using the server-side endpoint you
	        // created in step 3.
	        fetch('/create-checkout-session', {
	          method: 'POST',
	        })
	        .then(function(response) {
	          return response.json();
	        })
	        .then(function(session) {
	          return stripe.redirectToCheckout({ sessionId: session.id });
	        })
	        .then(function(result) {
	          // If `redirectToCheckout` fails due to a browser or network
	          // error, you should display the localized error message to your
	          // customer using `error.message`.
	          if (result.error) {
	            alert(result.error.message);
	          }
	        })
	        .catch(function(error) {
	          console.error('Error:', error);
	        });
	      });
	    </script>
	</div>
</div>

<?php perch_layout('global.footer'); ?>