<?php

namespace app\models\search;

/**
 * This is the ActiveQuery class for [[Text]].
 *
 * @see Text
 */
class TextQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        $this->andWhere('[[status]]=1');
        return $this;
    }*/

    /**
     * @inheritdoc
     * @return Text[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return Text|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
