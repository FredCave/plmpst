<?php get_header(); ?>
	
<div id="global_iframe_wrapper">

	<div id="wrapper_en" class="iframes_wrapper">
		<iframe class="iframe_one" src=""></iframe>
		<iframe class="iframe_two" src=""></iframe>
		<iframe class="iframe_three" src=""></iframe>
	</div>

	<div id="wrapper_he" class="iframes_wrapper">
		<iframe class="iframe_one" src=""></iframe>
		<iframe class="iframe_two" src=""></iframe>
		<iframe class="iframe_three" src=""></iframe>
	</div>

	<div id="wrapper_ar" class="iframes_wrapper">
		<iframe class="iframe_one" src=""></iframe>
		<iframe class="iframe_two" src=""></iframe>
		<iframe class="iframe_three" src=""></iframe>
	</div>

</div>

<div id="wrapper">

	<div id="top_bar">
		<div id="top_bar_info"><span class="day">15</span> <span class="month">January</span>, <span class="year">2001</span></div>
		<ul id="top_bar_langs">
			<li id="en_link" class="selected">En</li>
			<li id="he_link">He</li>
			<li id="ar_link">Ar</li>
		</ul>
	</div>

	<div id="down_arrow">
		<img src="<?php bloginfo( 'template_url' ); ?>/assets/img/down_arrow.svg" />
	</div>

	<div id="text_wrapper">

		<?php 
		$texts_query = new WP_Query( array (
			"post_type" => "post"
		));
		if ( $texts_query->have_posts() ) :
			while ( $texts_query->have_posts() ) : $texts_query->the_post();
				$slug = basename(get_permalink()); ?>

				<div class="text" id="<?php echo $slug; ?>">
					<div class="inner_wrapper">
						<div class="main_text">
							<?php the_content(); ?>
						</div>

					</div>

				</div>

			<?php 
			endwhile;
		endif;
		?>

		<div id="logo_wrapper">
			<div class="logo">
				<img src="<?php bloginfo('template_url'); ?>/assets/img/logo.svg" />
			</div>
			<div class="after_logo_text">
				<?php the_field("after_logo_text"); ?>
			</div>
		</div>

		<div id="text_footer">
	
			<div>
				<div><a target="_blank" href="">Mekudeshet</a></div>
				<div><a target="_blank" href="">Facebook</a></div>
				<div><a target="_blank" href="">Instagram</a></div>
				<div>Add to <a target="_blank" href="">Google Calendar</a> or <a target="_blank" href="">iCal</a></div>
			</div>
		</div>	

	</div>

	<div id="loading">
		<img src="<?php bloginfo( 'template_url' ); ?>/assets/img/plm_wheel.svg" />
	</div>

</div>
	
<?php get_footer(); ?>