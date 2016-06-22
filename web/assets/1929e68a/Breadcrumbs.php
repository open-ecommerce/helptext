<?php

/**
 *  @link    http://foundationize.com
 *  @package foundationize/yii2-foundation
 *  @version 1.0.0
 */

namespace foundationize\foundation;

/**
 * Description of Breadcrumbs
 *
 
 */
class Breadcrumbs extends \yii\widgets\Breadcrumbs {

  public $options = ['class' => 'breadcrumbs'];
  
  public $activeItemTemplate = "<li class=\"current\">{link}</li>\n";

}
