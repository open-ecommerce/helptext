<?php
namespace app\assets;

use yii\helpers\FileHelper;
use yii\web\AssetBundle;

class AppAsset extends AssetBundle
{
    //public $sourcePath = '@app/assets/dist';
    public $sourcePath = '@app/assets/web/dist';
    public $css = [ 'css/app.css' ];
    public $js = [ 'js/app.js' ];
    public $depends = [
        'yii\web\YiiAsset',
        //'foundationize\foundation\FoundationAsset', // in with the new   
        'yii\bootstrap\BootstrapPluginAsset',
        // if we recompile the less files from 'yii\bootstrap\BootstrapAsset' and include the css in app.css
        // we need set bundle to `false` in application config and remove the following line
        'yii\bootstrap\BootstrapAsset',
    ];
}
