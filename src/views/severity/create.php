<?php

use yii\helpers\Html;

/**
* @var yii\web\View $this
* @var app\models\Severity $model
*/

$this->title = Yii::t('app', 'Create Severity');
$this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'Severities'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="container">
  <div class="col-md-12 severity-create">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3>
          <?= Yii::t('app', 'Severity') ?>        <small>
            <?= $model->id ?>        </small>
          </h3>
      </div>
      <div class="clearfix crud-navigation">
          <div class="pull-left">
            <?=             Html::a(
            Yii::t('app', 'Cancel'),
            \yii\helpers\Url::previous(),
            ['class' => 'btn btn-default']) ?>
          </div>
      </div>
        <hr />

        <?= $this->render('_form', [
          'model' => $model,
        ]); ?>

      </div>
    </div>
  </div>
  
