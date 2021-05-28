<?php include($_SERVER['DOCUMENT_ROOT'].'/perch/runtime.php'); ?>
<?php perch_layout('global.header'); ?>

<?php

    function printArray($item, $depth = 0)
    {
    foreach ($item as $key => $value) {
        $depthString = str_repeat("--", $depth);
        if (gettype($value) !== "array") {
            echo "$depthString $key: $value <br>";
        } else {
            echo "$depthString $key: <br>";
            printArray($value, $depth + 1);
        }
    }
    }

perch_content_create("Videos", ["template" => "videos.html"]);

?>

<?php
    $page = PerchSystem::get_page();
    if (strpos($page, "index.php")) {
        $page = explode("index.php", $page)[0];
    }
?>
<?php if (perch_get("v")) {

    ?>

    <div class="restrict">
    <a href="<?= $page ?>" style="margin-bottom: 1.5rem; display: block">Back to videos</a>

    <?php
    
    $blocks = perch_content_custom("Videos", ["skip-template" => true], true)[0]["_blocks"];
    
    $talkContainers = [];

    foreach ($blocks as $block) {
        foreach ($block as $key => $value) {
            if ($key == "talkContainer") {
                $talkContainers[] = $block["talkContainer"];
            }
        }
    }

    $selectedTalk;
    $slug = perch_get("v");

    foreach ($talkContainers as $container) {
        foreach ($container as $talk) {
            if ($talk["slug"] == $slug) {
                $selectedTalk = $talk;
                break;
            }
        }
        if ($selectedTalk) {
            break;
        }
    }

    perch_template("content/video.html", $selectedTalk);

} else {
	perch_content('Page Content'); 
    perch_content_custom("Videos", ["template" => "videos_thumbnails.html"]);
}

?>

<?php perch_layout('global.footer'); ?>