<?php

namespace app\models;

/**
 * This is the ActiveQuery class for [[CaseCategory]].
 *
 * @see CaseCategory
 */
class CaseCategoryQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        $this->andWhere('[[status]]=1');
        return $this;
    }*/

    /**
     * @inheritdoc
     * @return CaseCategory[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return CaseCategory|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
