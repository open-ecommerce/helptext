<?php

use app\assets\AppAsset;
//use app\widgets\Alert;
use kartik\widgets\Growl;
use yii\helpers\Html;

/* @var $this \yii\web\View */
/* @var $content string */
$this->title = $this->title;

switch (Yii::$app->settings->get('registerPrototypeAsset', 'app.assets')) {
    case true:
        \dmstr\modules\prototype\assets\DbAsset::register($this);
        break;
    case null:
        Yii::$app->settings->set('registerPrototypeAsset', true, 'app.assets');
        Yii::$app->settings->deactivate('registerPrototypeAsset', 'app.assets');
    case false:
        AppAsset::register($this);
}

$bundle = AppAsset::register($this);
$imgPath = $bundle->baseUrl;
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
    <head>
        <meta charset="<?= Yii::$app->charset ?>"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
        <link rel="apple-touch-icon" sizes="57x57" href="<?php echo $imgPath; ?>/img/icons/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="<?php echo $imgPath; ?>/img/icons/apple-touch-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="<?php echo $imgPath; ?>/img/icons/apple-touch-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="<?php echo $imgPath; ?>/img/icons/apple-touch-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="<?php echo $imgPath; ?>/img/icons/apple-touch-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="<?php echo $imgPath; ?>/img/icons/apple-touch-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="<?php echo $imgPath; ?>/img/icons/apple-touch-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="<?php echo $imgPath; ?>/img/icons/apple-touch-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="<?php echo $imgPath; ?>/img/icons/apple-touch-icon-180x180.png">
        <link rel="icon" type="image/png" href="<?php echo $imgPath; ?>/img/icons/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="<?php echo $imgPath; ?>/img/icons/android-chrome-192x192.png" sizes="192x192">
        <link rel="icon" type="image/png" href="<?php echo $imgPath; ?>/img/icons/favicon-96x96.png" sizes="96x96">
        <link rel="icon" type="image/png" href="<?php echo $imgPath; ?>/img/icons/favicon-16x16.png" sizes="16x16">
        <link rel="manifest" href="<?php echo $imgPath; ?>/img/icons/manifest.json">
        <link rel="mask-icon" href="<?php echo $imgPath; ?>/img/icons/safari-pinned-tab.svg" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="msapplication-TileImage" content="/mstile-144x144.png">
        <meta name="theme-color" content="#ffffff">
        <?= Html::csrfMetaTags() ?>
        <title><?= Html::encode($this->title) ?></title>

        <?php $this->head() ?>    

    </head>
    <body>
        <?php $this->beginBody() ?>
        <div class="wrap">

            <div id="top-menu">
            <?= $this->render('_navbar') ?>
            </div>

            <div class="container">
                    <?php
                    //Get all flash messages and loop through them
                    foreach (Yii::$app->session->getAllFlashes() as $message):;
                        echo \kartik\widgets\Growl::widget([
                            'type' => (!empty($message['type'])) ? $message['type'] : 'danger',
                            'title' => (!empty($message['title'])) ? Html::encode($message['title']) : 'Title Not Set!',
                            'icon' => (!empty($message['icon'])) ? $message['icon'] : 'fa fa-info',
                            'body' => (!empty($message['message'])) ? Html::encode($message['message']) : 'Message Not Set!',
                            'showSeparator' => true,
                            'delay' => 1, //This delay is how long before the message shows
                            'pluginOptions' => [
                                'delay' => (!empty($message['duration'])) ? $message['duration'] : 3000, //This delay is how long the message shows for
                                'placement' => [
                                    'from' => (!empty($message['positonY'])) ? $message['positonY'] : 'top',
                                    'align' => (!empty($message['positonX'])) ? $message['positonX'] : 'right',
                                ]
                            ]
                        ]);
                    endforeach;
                    ?>
            </div>        

            
            <?= $content ?>
        </div>






        <footer class="footer">
            <div class="container">
                <p class="pull-right">
                    <span class="label label-default"><?= YII_ENV ?></span>
                </p>
                <p class="pull-left">
                    <?=
                    Html::a(
                            Html::img($imgPath . '/img/logos/powered-by-open-ecommerce-org-wite.png', ['alt' => 'Powered by Open-ecommerce.org']), '#', ['data-toggle' => 'modal', 'data-target' => '#infoModal']
                    )
                    ?>
                </p>
            </div>
        </footer>

        <!-- Info Modal -->
        <div class="modal fade" id="infoModal" tabindex="-1" role="dialog" aria-hidden="true">
            <?= $this->render('_modal-info') ?>
        </div>

        <?php $this->endBody() ?>
    </body>
</html>
<?php $this->endPage() ?>
