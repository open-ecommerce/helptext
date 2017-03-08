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
        'js/app.min.js',
    ];

    public $css = [
       //'css/app.css', //dev
       'css/app.min.css', // production
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
