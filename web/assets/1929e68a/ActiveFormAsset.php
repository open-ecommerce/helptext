<?php

/**
 *  @link    http://foundationize.com
 *  @package foundationize/yii2-foundation
 *  @version dev
 */

namespace foundationize\foundation;

use yii\web\AssetBundle;

/**
 * Asset bundle for the Widget js files.
 *
 
 * @since 0.0.1
 * @see
 */
class ActiveFormAsset extends AssetBundle {

  public $sourcePath = '@vendor/foundationize/yii2-foundation';
  public $js = [
      'js/foundation.activeForm.js'
  ];
}
