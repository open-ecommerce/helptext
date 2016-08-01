<?php

namespace app\models;

/**
 * This is the ActiveQuery class for [[Severity]].
 *
 * @see Severity
 */
class SeverityQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        $this->andWhere('[[status]]=1');
        return $this;
    }*/

    /**
     * @inheritdoc
     * @return Severity[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return Severity|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
