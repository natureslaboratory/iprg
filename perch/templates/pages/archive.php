<?php include($_SERVER['DOCUMENT_ROOT'].'/perch/runtime.php'); ?>
<?php perch_layout('global.header'); ?>
	
	<div class="wrap">
	    <div class="restrict">
			<div class="blog">
		    <?php 
		        
			    $posts_per_page = 10;
			    $template 		= 'post_in_list.html';
			    $sort_order		= 'DESC';
			    $sort_by		= 'postDateTime';
			    
			    if (perch_get('tag')) {
				    
				    $html = '<h1 class="span">Archive of: '.perch_blog_tag(perch_get('tag'), true).'</h1><div>';
					$html .= perch_blog_custom([
						'tag'   	 => perch_get('tag'),
						'template'   => $template,
						'count'      => $posts_per_page,
						'sort'       => $sort_by,
						'sort-order' => $sort_order,
						'return-html' => true
		                ],true);
		            
		            echo $html;
			
			    }
		    
		    ?>
			</div>

				<aside>
				    <h2>Search</h2>
			        <form method="post" action="/search" class="search">
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
				        perch_blog_tags();
				    ?>
			
			    </aside>
			    
			</div>
	    </div>
    </div>

    <?php perch_layout('global.footer'); ?>