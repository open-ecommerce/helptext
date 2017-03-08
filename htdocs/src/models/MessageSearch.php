<?php

namespace app\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\models\Message;

/**
 * MessageSearch represents the model behind the search form about `app\models\Message`.
 */
class MessageSearch extends Message
{
    
    
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'id_case', 'id_sender_type', 'id_message_type'], 'integer'],
            [['id_phone', 'message', 'sent'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = Message::find();

        // add conditions that should always apply here

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to return any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        // grid filtering conditions
        $query->andFilterWhere([
            'id' => $this->id,
            'id_case' => $this->id_case,
            'id_sender_type' => $this->id_sender_type,
            'id_message_type' => $this->id_message_type,
            'sent' => $this->sent,
        ]);

        $query->andFilterWhere(['like', 'id_phone', $this->id_phone])
            ->andFilterWhere(['like', 'message', $this->message]);

        return $dataProvider;
    }
}
