<?php


use yii\helpers\Html;

/**
* @var yii\web\View $this
* @var app\models\Cases $model
*/

$this->title = Yii::t('app', 'Cases') . $model->id . ', ' . Yii::t('app', 'Edit');

?>
<div class="container contact-update">
    <div class="col-md-10 col-md-offset-1">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3>
                    <?= Yii::t('app', 'Update cases') ?>        <small>
                        <?= $model->id ?>        </small>
                </h3>
            </div>

            <div class="panel-body">

                <?=
                $this->render('_form', [
                    'model' => $model,
                ]);
                ?>
            </div>
        </div>
    </div>
</div>
