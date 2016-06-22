<?php

/**
 *  @link    http://foundationize.com
 *  @package foundationize/yii2-foundation
 *  @version 1.0.0
 */

namespace foundationize\foundation;

use yii\web\AssetBundle;

/**
 * Asset bundle for the foundation icons css.
 *
 
 */
class FoundationIconAsset extends AssetBundle {

  public $sourcePath = '@vendor/foundationize/yii2-foundation/foundation-icons';
  public $css = [
      'foundation-icons.css'
  ];

}
