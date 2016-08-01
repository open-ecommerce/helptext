<?php

namespace app\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\models\Cases;

/**
 * CasesSearch represents the model behind the search form about `app\models\Cases`.
 */
class CasesSearch extends Cases {

    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['id', 'id_contact', 'id_category', 'id_severity', 'id_outcome'], 'integer'],
            [['start_date', 'close_date', 'state', 'comments'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function scenarios() {
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
    public function search($params) {
        $query = Cases::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $this->load($params);

        if (!$this->validate()) {
// uncomment the following line if you do not want to any records when validation fails
// $query->where('0=1');
            return $dataProvider;
        }

        $query->andFilterWhere([
            'id' => $this->id,
            'id_contact' => $this->id_contact,
            'id_category' => $this->id_category,
            'id_severity' => $this->id_severity,
            'id_outcome' => $this->id_outcome,
            'start_date' => $this->start_date,
            'close_date' => $this->close_date,
        ]);

        $query->andFilterWhere(['like', 'state', $this->state])
                ->andFilterWhere(['like', 'comments', $this->comments]);

        return $dataProvider;
    }

}
