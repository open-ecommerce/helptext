<?php

namespace app\models;

/**
 * This is the ActiveQuery class for [[OutcomeCategory]].
 *
 * @see OutcomeCategory
 */
class OutcomeCategoryQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        $this->andWhere('[[status]]=1');
        return $this;
    }*/

    /**
     * @inheritdoc
     * @return OutcomeCategory[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return OutcomeCategory|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
