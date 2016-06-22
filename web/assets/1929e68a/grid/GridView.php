<?php

/**
 *  @link    http://foundationize.com
 *  @package foundationize/yii2-foundation
 *  @version 0.0.1
 */

namespace foundationize\foundation\grid;

use foundationize\foundation\FoundationIconAsset;

/**
 * Description of GridView
 *
 
 */
class GridView extends \yii\grid\GridView {
  /**
     * @var array the HTML attributes for the grid table element.
     * @see \yii\helpers\Html::renderTagAttributes() for details on how attributes are being rendered.
     */
    public $tableOptions = ['class' => 'table', 'role' => 'grid']; 
    
    /**
     * @var array 
     * @see [[\yii\widgets\BaseListView::pager]]
     */
    public $pager = ['class' => 'foundationize\foundation\LinkPager'];
    
    /**
     * @inheritdoc
     */
    public function init() {
      parent::init();
      
      FoundationIconAsset::register($this->getView());
    }
}
