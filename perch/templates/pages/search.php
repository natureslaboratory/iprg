<?php include($_SERVER['DOCUMENT_ROOT'].'/perch/runtime.php'); ?>
<?php perch_layout('global.header'); ?>
    
    <div class="wrap">
	    <div class="restrict narrow">
    
    <?php 
	    $query = $_POST['q'];
		perch_content_search($query, array(
	
		));
   	?>
   	
	    </div>
    </div>

    <?php perch_layout('global.footer'); ?>