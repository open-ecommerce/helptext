<?php
/* @var $this yii\web\View */

use yii\helpers\Html;

$this->title = 'TextHelp+ for NNLS Drop-in';
?>
<div class="site-index ">
    <div class="header vert">
        <h2 class="lead">Welcome to the HelpText+ System!</h2>
    </div>
    <div class="featurette">
        <div class="container">
            <div class="row">
                <div class="col-md-12 text-center">
                    <div class="site-index">
                        <?= \dmstr\modules\prototype\widgets\HtmlWidget::widget(['enableFlash' => true]) ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
