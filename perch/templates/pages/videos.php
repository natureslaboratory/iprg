<?php include($_SERVER['DOCUMENT_ROOT'].'/perch/runtime.php'); ?>
<?php perch_layout('global.header'); ?>

<?php

perch_content_create("Videos", ["template" => "videos.html"]);

// $videos = 

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

    $videos = perch_content_custom("Videos", ["skip-template" => true], true)[0]["talkContainer"];
    foreach ($videos as $video) {
        if ($video["slug"] == perch_get("v")) {
            ?>
                <div class="c-talk__URL" data-url="<?= $video["videoURL"] ?>" data-slug="<?= $video["slug"] ?>"></div>
                <div class="c-talk__details">
                    <h3><?= $video["talkTitle"] ?></h3>
                    <h4> <?= $video["speaker"] ?></h4>
                    <div class="c-talk__description">
                        <?= $video["abstract"]["processed"] ?>
                    </div>
                </div>
            <?php
        }
    }

    ?>
    </div>
    <?php


    // echo perch_get("v");
    // perch_content_custom("Videos", ["data" => ["videoSlug" => perch_get("v")]]);

} else {

	perch_content('Page Content'); 
    perch_content_custom("Videos", ["template" => "videos_thumbnails.html", "data" => ["page" => $page]]);
}

?>

<?php perch_layout('global.footer'); ?>