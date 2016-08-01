<?php

use yii\helpers\Html;

/**
* @var yii\web\View $this
* @var app\models\Cases $model
*/

$this->title = Yii::t('app', 'Create New Case');
$this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'Cases'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="container case-create">
  <div class="col-md-8 col-md-offset-2">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3>
                    <?= Yii::t('app', 'Create New Case') ?>        <small>
                        <?= $model->id ?>        </small>
                </h3>
            </div>
            <div class="panel-body">

              <?= $this->render('_form', [
              'model' => $model,
              ]); ?>
            </div>
        </div>
    </div>
</div>
