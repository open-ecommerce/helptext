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
        <h1 class="text-center">HELPText+ is a helpline platform.</h2>
          <h2 class="text-center">Designed exclusively to empower non-profit helplines like yours.</h2>
        <br>
        <div class="container">
            <div class="col-md-12 text-center">
                <div>
                    <div id="hero">
                        <?= Html::img($imgPath . '/img/helptext-intro.png', ['alt' => 'Helptext Helpline Solution for helplines']) ?>
                    </div>
                </div>
                <br>
                <p class="text-center"><i>Try our online demo</i></p>
            </div>
        </div>
    </div>
</div>
<br>
<br>
