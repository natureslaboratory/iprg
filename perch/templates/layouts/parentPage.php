<?php

$nav = perch_pages_navigation([
    "skip-template" => true,
    "flat" => true
]);

foreach ($nav as $key => $value) {
    echo "{$key}: {$value} <br/>";
}

?>