<?php

use yii\helpers\Html;

/**
* @var yii\web\View $this
* @var app\models\CaseCategory $model
*/

$this->title = Yii::t('app', 'Create');
$this->params['breadcrumbs'][] = ['label' => Yii::t('app', 'CaseCategories'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="container case-category-create">
  <div class="col-md-10 col-md-offset-1">
    <div class="panel panel-default">
      <div class="panel-heading">
    <h3>
        <?= Yii::t('app', 'CaseCategory') ?>        <small>
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
</div>
</div>
</div>
    <?= $this->render('_form', [
    'model' => $model,
    ]); ?>

</div>
