<?php get_header(); ?>
	
<div id="iframes_wrapper">

	<iframe id="background_one" src=""></iframe>
	<iframe id="background_two" src=""></iframe>

</div>

<div id="wrapper">

	<div id="top_bar">
		<div id="top_bar_info"><span class="day">9</span> <span class="month">December</span>, <span class="year">9999</span></div>
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

						<div class="logo">
							<img src="<?php bloginfo('template_url'); ?>/assets/img/logo.svg" />
						</div>

						<div class="after_logo_text">
							<?php the_field("after_logo_text"); ?>
						</div>

					</div>

				</div>

			<?php 
			endwhile;
		endif;
		?>

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