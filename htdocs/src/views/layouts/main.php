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
$imgClientPath = \Yii::$app->settings->get('helptext.icons_folder');
?>

<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
    <head>
        <meta charset="<?= Yii::$app->charset ?>"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
        <link rel="apple-touch-icon" sizes="180x180" href="<?php echo $imgPath; ?>/img/icons/<?php echo $imgClientPath; ?>/apple-touch-icon.png">
        <link rel="icon" type="image/png" href="<?php echo $imgPath; ?>/img/icons/<?php echo $imgClientPath; ?>/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="<?php echo $imgPath; ?>/img/icons/<?php echo $imgClientPath; ?>/favicon-16x16.png" sizes="16x16">
        <link rel="manifest" href="<?php echo $imgPath; ?>/img/icons/<?php echo $imgClientPath; ?>/manifest.json">
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
                <p class="pull-left">

                    <?=
                    Html::a(
                            Html::img($imgPath . '/img/logos/powered-by-open-ecommerce-org-wite.png', ['alt' => 'Powered by Open-ecommerce.org']), '#', ['data-toggle' => 'modal', 'data-target' => '#infoModal']
                    )
                    ?>
                    <span class="label label-default"><?= YII_ENV ?></span>
                </p>
                <p class="pull-right">
                  <span class="alert alert-success"> Call us for a quote: 07879387106 </span>
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
