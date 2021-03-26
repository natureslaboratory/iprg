<!doctype html>
<html lang="en-gb">

<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<?php
	if (perch_get('s')) {
		perch_blog_post_meta(perch_get('s'));
	} else {
	?>
		<title><?php perch_pages_title(); ?></title>
		<?php perch_page_attributes(); ?>
	<?php
	}
	?>

	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
	<link rel="preconnect" href="https://kit.fontawesome.com" crossorigin />

	<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Ropa+Sans&display=swap" />
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Ropa+Sans&display=swap" media="print" onload="this.media='all'" />
	<noscript>
		<link href="https://fonts.googleapis.com/css2?family=Ropa+Sans&display=swap" rel="stylesheet">
	</noscript>
	<link rel="stylesheet" href="/assets/css/stylesheet.css?v=<?php echo rand(); ?>">
	<script src="https://js.stripe.com/v3/"></script>
</head>

<body>
	<header>
		<div class="restrict">
			<p class="logo"><a href="/"><?php perch_content('Logo'); ?></a></p>
			<nav class="navigation">
				<?php
				perch_pages_navigation(array(
					'template' => array('topNavMain.html', 'topNavSub.html')
				));
				?>
				<div class="hamburgerWrapper">
					<button class="hamburgerButton">
						<i class="fas fa-bars"></i>
					</button>
					<?php
					perch_pages_navigation(array(
						'template' => array('hamburgerMain.html', 'hamburgerSub.html')
					))
					?>
				</div>
			</nav>
		</div>
	</header>