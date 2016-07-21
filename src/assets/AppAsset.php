<?php

namespace app\assets;

/*
 * @link http://www.yiiframework.com/
 *
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

use yii\helpers\FileHelper;
use yii\web\AssetBundle;

/**
 * Configuration for `backend` client script files.
 *
 * @since 4.0
 */
class AppAsset extends AssetBundle
{
    public $sourcePath = '@app/assets/web/dist';

    public $js = [
        'js/app.js',
    ];

    public $css = [
<<<<<<< HEAD
        // Note: we are using gulp to compile and generate the app.less in the dist folder
=======
        // Note: less files require a compiler (available by default on Phundament Docker images)
        // use .css alternatively
        // 'less/app.less',
>>>>>>> mariango
           'css/app.css',
    ];

    public $depends = [
        'yii\web\YiiAsset',
        //'foundationize\foundation\FoundationAsset', // in with the new
        'yii\bootstrap\BootstrapPluginAsset',
        // if we recompile the less files from 'yii\bootstrap\BootstrapAsset' and include the css in app.css
        // we need set bundle to `false` in application config and remove the following line
        'yii\bootstrap\BootstrapAsset',
    ];

}
