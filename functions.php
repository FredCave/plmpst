<?php

// SECURITY: HIDE USERNAMES
add_action(‘template_redirect’, ‘bwp_template_redirect’);
function bwp_template_redirect() {
    if ( is_author() ) {
        wp_redirect( home_url() ); 
        exit;
    }
}

// HIDE VERSION OF WORDPRESS
function wpversion_remove_version() {
        return '';
    }
add_filter('the_generator', 'wpversion_remove_version');

// REMOVE DASHICONS
function wpdocs_dequeue_dashicon() {
    // if (current_user_can( 'update_core' )) {
    //     return;
    // }
    wp_deregister_style('dashicons');
}
add_action( 'wp_enqueue_scripts', 'wpdocs_dequeue_dashicon' );

// REMOVE EMOJIS
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

// ENQUEUE CUSTOM SCRIPTS
function enqueue_mtd_scripts() {
  
    wp_deregister_script( 'jquery' );
	wp_register_script( 'jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js');
    // wp_register_script( 'jquery', get_template_directory_uri() . '/js/__jquery.min.js');
    wp_enqueue_script( 'jquery' );  
 
}
add_action('wp_enqueue_scripts', 'enqueue_mtd_scripts');

// ADD CUSTOM POST TYPES
// add_action( 'init', 'create_post_types' );
// function create_post_types() {
//     register_post_type( 'articles',
//     array(
//         'labels' => array(
//             'name' => __( 'Articles' )
//         ),
//         'public' => true,
//         'show_in_rest' => true,
//         'taxonomies' => array('category','post_tag'),
//         'has_archive' => true,
//         'supports' => array('editor','title'),
//         'menu_position' => 5
//         )
//     );
// }
