<?php include($_SERVER['DOCUMENT_ROOT'].'/perch/runtime.php'); ?>
<?php
	perch_layout('global.header'); 
?>
    
    <div class="wrap">
	    <div class="restrict">
			<div class="blog">
				<?php
				if(!perch_get('s')){   
					echo '<h1 class="span">WelshRev Blog</h1>';
			    }
			    ?>
				<div>
					
			    <?php 
			        if(perch_get('s')){
				        perch_blog_post(perch_get('s')); 
			        }else{
				        perch_blog_custom(array(
						  'count'      => 10,
						  'template'   => 'post_in_list.html',
						  'sort'       => 'postDateTime',
						  'sort-order' => 'DESC',
						  'section'    => 'posts'
						));
			       	}
			    ?>
				</div>

			    <aside>
				    <h2>Search</h2>
			        <form method="post" action="/search/" class="search">
			            <div class="form-group">
			                <div>
			                    <input type="text" placeholder='Search Keyword'
			                        onfocus="this.placeholder = ''"
			                        onblur="this.placeholder = 'Search Keyword'" name="q">
			                </div>
			            </div>
			            <input type="submit" value="Search" />
			        </form>
		
			        <?php 
				        perch_blog_categories(); 
				    ?>
			
			        <?php 
			            perch_blog_custom(array(
						  'count'      => 10,
						  'template'   => 'post_in_list_minimal.html',
						  'sort'       => 'postDateTime',
						  'sort-order' => 'DESC',
						  'section'    => 'posts'
						));
			        ?>
			        
			        <?php 
				        perch_blog_tags();
				    ?>

			    </aside>
			    
			</div>
	    </div>
    </div>

    <?php 
	    perch_layout('global.footer'); 
    ?>