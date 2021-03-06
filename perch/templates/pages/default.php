<?php if (!defined('PERCH_RUNWAY')) include($_SERVER['DOCUMENT_ROOT'].'/perch/runtime.php'); ?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
	<title><?php perch_pages_title(); ?></title>
	<?php perch_page_attributes(); ?>
</head>
<body>
    <?php perch_content('Content'); ?>
</body>
</html>