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
        <h1 class="text-center">HELPText+ Messaging Platform</h2>
          <p class="text-center">Improved access to your service users, effective management of messages and clear reports on impact.</p>
          <a class="btn btn-primary center-block" href="en/user/login" style="width:80px">Sign In</a>
        <div class="container">
            <div class="col-md-12 text-center">
                <div>
                    <div id="hero">
                        <?= Html::img($imgPath . '/img/helptext-intro.png', ['alt' => 'Helptext Helpline Solution for helplines']) ?>
                    </div>
                    <br>
                    <br>

                </div>
            </div>
        </div>
    </div>
</div>
