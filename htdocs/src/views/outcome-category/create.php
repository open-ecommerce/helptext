<?php

use yii\helpers\Html;

/**
* @var yii\web\View $this
* @var app\models\OutcomeCategory $model
*/

$this->title = Yii::t('app', 'Create Category');
$this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'OutcomeCategories'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="container outcome-create">
  <div class="col-md-8 col-md-offset-2">
    <div class="panel panel-default">
        <div class="panel-heading">
          <h3>
            <?= Yii::t('app', 'Outcome Category') ?>        <small>
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
