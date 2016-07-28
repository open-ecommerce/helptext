<?php
/* @var $this yii\web\View */

use app\assets\AppAsset;
use app\widgets\Alert;
use yii\helpers\Html;

$bundle = AppAsset::register($this);
$imgPath = $bundle->baseUrl;

$this->title = 'TextHelp+ for NNLS Drop-in';
?>
<div class="site-index">
    <div class="col-md-12">
        <h1 class="text-center">Welcome to the NNLS Destitute Asylum Seekers Message System!</h1>
        <br>
        <div class="container">
            <div class="col-md-12 text-center">
                <div>
                    <div id="hero">
                        <?= Html::img($imgPath . '/img/dropin-logo.jpg', ['alt' => 'Helptext Helpline Solution for NNLS']) ?>
                    </div>                
                </div>
                <br>
                <p class="text-center"><i>We are in beta and any input will be much appreciated...</i></p>
            </div>
        </div>
    </div>
</div>
<br>
<br>
