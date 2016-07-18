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
<div class="customers-index col-md-12">
<div class="giiant-crud outcome-category-create">

    <h3>
        <?= Yii::t('app', 'Outcome Category') ?>        <small>
                        <?= $model->id ?>        </small>
    </h3>

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
