<?php

use yii\helpers\Html;

/**
* @var yii\web\View $this
* @var app\models\Text $model
*/

$this->title = Yii::t('app', 'Send Text');
$this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'Send Text'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="container text-create">
  <div class="col-md-8 col-md-offset-2">
    <div class="panel panel-default">
        <div class="panel-heading">
          <h3>
        <?= Yii::t('app', 'Send Text') ?>        <small>
                        <?= $model->id ?>        </small>
          </h3>
        </div>
    <?= $this->render('_form', [
    'model' => $model,
    ]); ?>
  </div>
</div>
</div>
