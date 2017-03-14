<?php

use yii\helpers\Html;
use app\assets\AppAsset;

$bundle = AppAsset::register($this);
$imgPath = $bundle->baseUrl;


?>
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-body">
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
                    class="sr-only">Close</span></button>
            <div class="text-center">
                <?= Html::img($imgPath.'/img/icons/android-chrome-192x192.png', ['alt' => 'HelpText+']) ?>
                <h3><?= getenv('APP_NAME') ?></h3>

                <p>
                    Application Version <b><?= getenv('APP_NAME') ?>-<?= APP_VERSION ?></b><br>
                    Virtual Host <b><?= isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '' ?></b><br/>
                    Hostname <b><?= getenv('HOSTNAME') ?: 'local' ?></b>
                </p>

                <p class="small">
                    <?= Html::a(Html::img($imgPath.'/img/logos/powered-by-open-ecommerce-org-wite.png', ['alt' => 'Powered by Open-ecommerce.org']), 'http://open-ecommerce.org') ?>
                </p>
            </div>
        </div>
    </div>
</div>
