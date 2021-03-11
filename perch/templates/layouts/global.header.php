<?php

class perchNavigation
{
	public function getDynamicNav()
	{
		$navigationArray = perch_pages_navigation(array(
			'skip-template' => true
		));

		$navigation = "<ul>";
		$hamburger = "<ul>";
		$links = "";
		foreach ($navigationArray as $key => $value) {
			$newLink = "<li><a href={$value["pagePath"]}>{$value["pageTitle"]}</a></li>";
			$links .= $newLink;
		}

		$hamburger .= $links . "</ul>";
		$navigation .= $links . "</ul>
                                <div class='hamburgerWrapper'>
                                    <button id='hamburgerButton'>
                                        <i class='fas fa-bars'>
                                        </i>
                                    </button>
                                    <ul id='hamburger'>
                                        {$links}
                                    </ul>
                                </div>";

		return $navigation;
	}

	public function echoNewDynamicNav()
	{
		echo "<ul id='dynamic_nav'>";
		perch_pages_navigation(array(
			'template' => 'item.html'
		));
		echo  "</ul>
				<div class='hamburgerWrapper'>
					<button id='hamburgerButton'>
						<i class='fas fa-bars'>
						</i>
					</button>
					<ul id='hamburger'>";
		perch_pages_navigation(array(
			'template' => 'hamburger.html'
		));				
		echo "</ul></div>";
	}
}

?>


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
</head>

<body>
	<header>
		<div class="restrict">
			<p class="logo"><a href="/"><?php perch_content('Logo'); ?></a></p>
			<nav class="navigation">
				<?php
				// ini_set('display_errors', 1);
				// ini_set('display_startup_errors', 1);
				// error_reporting(E_ALL);

				$navigation = new perchNavigation();
				// echo $navigation->getNavigation();
				$navigation->echoNewDynamicNav();


				?>
			</nav>
		</div>
	</header>