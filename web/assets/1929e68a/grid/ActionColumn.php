<?php

/**
 *  @link    http://foundationize.com
 *  @package foundationize/yii2-foundation
 *  @version 1.0.0
 */

namespace foundationize\foundation\grid;

use Yii;
use foundationize\foundation\helpers\Html;

/**
 * Description of ActionColumn
 *
 
 */
class ActionColumn extends \yii\grid\ActionColumn {

  /**
   * Initializes the default button rendering callbacks
   */
  protected function initDefaultButtons() {
    if (!isset($this->buttons['view'])) {
      $this->buttons['view'] = function ($url, $model) {
        return Html::a(Html::icon('eye'), $url, [
                'title' => Yii::t('yii', 'View'),
                'data-pjax' => '0',
        ]);
      };
    }
    if (!isset($this->buttons['update'])) {
      $this->buttons['update'] = function ($url, $model) {
        return Html::a(Html::icon('pencil'), $url, [
                'title' => Yii::t('yii', 'Update'),
                'data-pjax' => '0',
        ]);
      };
    }
    if (!isset($this->buttons['delete'])) {
      $this->buttons['delete'] = function ($url, $model) {
        return Html::a(Html::icon('trash'), $url, [
                'title' => Yii::t('yii', 'Delete'),
                'data-confirm' => Yii::t('yii', 'Are you sure you want to delete this item?'),
                'data-method' => 'post',
                'data-pjax' => '0',
        ]);
      };
    }
  }

}
