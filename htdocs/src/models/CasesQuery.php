<?php

namespace app\models;

/**
 * This is the ActiveQuery class for [[Cases]].
 *
 * @see Cases
 */
class CasesQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        $this->andWhere('[[status]]=1');
        return $this;
    }*/

    /**
     * @inheritdoc
     * @return Cases[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return Cases|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
