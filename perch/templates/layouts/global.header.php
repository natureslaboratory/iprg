<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class perchNavigation
{
	// public function getDynamicNav()
	// {
	// 	$navigationArray = perch_pages_navigation(array(
	// 		'skip-template' => true
	// 	));

	// 	$navigation = "<ul>";
	// 	$hamburger = "<ul>";
	// 	$links = "";
	// 	foreach ($navigationArray as $key => $value) {
	// 		$newLink = "<li><a href={$value["pagePath"]}>{$value["pageTitle"]}</a></li>";
	// 		$links .= $newLink;
	// 	}

	// 	$hamburger .= $links . "</ul>";
	// 	$navigation .= $links . "</ul>
    //                             <div class='hamburgerWrapper'>
    //                                 <button id='hamburgerButton'>
    //                                     <i class='fas fa-bars'>
    //                                     </i>
    //                                 </button>
    //                                 <ul id='hamburger'>
    //                                     {$links}
    //                                 </ul>
    //                             </div>";

	// 	return $navigation;
	// }

	public function echoNewDynamicNav()
	{
		$navigationAssocArray = perch_pages_navigation(array(
			'skip-template' => true,
			'flat' => true
		));

		// foreach ($navigationAssocArray as $key => $value) {
		// 	foreach ($value as $itemKey => $item) {
		// 		if (gettype($item) == "array") {
		// 			foreach ($item as $subItemKey => $subItemValue) {
		// 				echo nl2br("-- {$subItemKey}: ${subItemValue} \n");
		// 			}
		// 		}
		// 	}
		// }

		// $array = $this->buildAssocArray($navigationAssocArray);
		// foreach ($array as $value) {
		// 	echo $value;
		// 	echo "<br />";
		// }


		$fullNav = $this->buildNav($navigationAssocArray, "dynamic_nav", "fas fa-angle-down", 0);
		$fullNav .= "<div class='hamburgerWrapper'>
						<button id='hamburgerButton'>
							<i class='fas fa-bars'></i>
						</button>
							";
		$fullNav .= $this->buildNav($navigationAssocArray, "hamburger", "fas fa-angle-left", 0);
		$fullNav .= "</div>";

		echo $fullNav;

	}

	private function getPageByID($pages, $id)
	{
		foreach ($pages as $value) {
			if ($value["pageID"] == $id) {
				return $value;
			}
		}
		return null;
	}

	// const buildNavObject = (elem) => {
//     if (!(elem.children.length > 0)) {
//         return {
//             tagName: elem.tagName,
//             id: elem.id,
//             classList: getClassList(elem),
//             href: elem.href,
//             innerHTML: elem.innerHTML,
//             children: []
//         }
//     }

//     let elemObj = {
//         tagName: elem.tagName,
//         id: elem.id,
//         classList: getClassList(elem),
//         children: []
//     }

//     let children = getChildren(elem);
//     for (let i = 0; i < children.length; i++) {
//         elemObj.children = [...elemObj.children, buildNavObject(children[i])]
//     }

//     return elemObj;
// }
	private function hasChildren($pageArray, $currentPage)
	{
		foreach ($pageArray as $page) {
			if ($page["pageParentID"] == $currentPage["pageID"]) {
				return true;
			}
		}
		return false;
	}

	private function hasParent($currentPage)
	{
		if (gettype($currentPage) !== "array") {
			return false;
		}
		if ($currentPage["pageParentID"] == 0) {
			return false;
		}
		return true;
	}

	private function getParent($pageArray, $currentPage)
	{
		foreach ($pageArray as $page) {
			if ($currentPage["pageParentID"] == $page["pageID"]) {
				return $page;
			}
		}
	}

	private function getDepth($pageArray, $currentPage)
	{
		$depth = 0;
		$page = $currentPage;
		while ($this->hasParent($currentPage)) {
			$currentPage = $this->getParent($pageArray, $currentPage);
			$depth += 1;
		}

		return $depth;
	}

	private function getChildren($pageArray, $currentPage) : array
	{
		$childArray = array();

		foreach ($pageArray as $page) {
			if ($page["pageParentID"] == $currentPage["pageID"]) {
				$childArray[] = $page;
			}
		}

		return $childArray;
	}

	public function buildNav($pageArray, $id, $submenuIcon, $depth = 0)
	{
		$checkedId = $id ? $id : "";
		$nav = "<ul data-depth={$depth} id={$id}>";
		foreach ($pageArray as $page) {
			if (!$this->hasChildren($pageArray, $page) && ($this->getDepth($pageArray, $page) == $depth)) {
				$element = "<li>
								<a href={$page['pagePath']}>
									{$page['pageNavText']}
								</a>
							  </li>";
				$nav .= $element;
				continue;
			}

			if ($this->hasChildren($pageArray, $page)) {
				$icon2 = "";
				if ($id == "hamburger") {
					$icon2 = "<i class='fas fa-angle-down hide mobile'></i>";
				}
				$nav .= "<li>
							{$icon2}
							<a href={$page['pagePath']}>
								<i class='{$submenuIcon}'></i>
								{$page['pageNavText']}
							</a>";
				$children = $this->getChildren($pageArray, $page);
				$newDepth = $depth + 1;
				$nav .= $this->buildNav($children, "", $submenuIcon, $newDepth);
			}

		}

		$nav .= "</ul>";
		return $nav;
	}

	public function hasSubItems($node)
	{
		if (gettype($node["subitems"]) == "array") {
			return true;
		}

		return false;	
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

				$navigation = new perchNavigation();
				// echo $navigation->getNavigation();
				$navigation->echoNewDynamicNav();


				?>
			</nav>
		</div>
	</header>