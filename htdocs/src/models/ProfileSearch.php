<?php

namespace app\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\models\Profile;

/**
 * ProfileSearch represents the model behind the search form about `app\models\Profile`.
 */
class ProfileSearch extends Profile {
    
    

    /**
     * @inheritdoc
     */

    public function rules() {
        return [
            [['user_id', 'id_country', 'availability', 'terms'], 'integer'],
            [['name', 'public_email', 'gravatar_email', 'gravatar_id', 'location', 'website', 'bio', 'skills', 'firstname', 'lastname', 'birthday', 'avatar', 'phone'], 'safe'],
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
        $query = Profile::find();
        

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
            'user_id' => $this->user_id,
            'id_country' => $this->id_country,
            'availability' => $this->availability,
            'birthday' => $this->birthday,
            'terms' => $this->terms,
        ]);

        $query->andFilterWhere(['like', 'name', $this->name])
                ->andFilterWhere(['like', 'location', $this->location])
                ->andFilterWhere(['like', 'firstname', $this->firstname])
                ->andFilterWhere(['like', 'lastname', $this->lastname])
                ->andFilterWhere(['like', 'phone', $this->phone]);

        return $dataProvider;
    }


    
    
    

}
