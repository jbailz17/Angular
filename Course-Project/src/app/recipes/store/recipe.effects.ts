import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import * as RecipeActions from '../store/recipe.actions';
import { Recipe } from '../recipe.model';
import * as fromRecipe from '../store/recipe.reducers';

@Injectable()
export class RecipeEffects {

  @Effect()
  recipeFetch = this.actions$.ofType(RecipeActions.FETCH_RECIPES).switchMap(
    (action: RecipeActions.FetchRecipes) => {
    return this.httpClient.get<Recipe[]>('https://recipe-book-dc232.firebaseio.com/recipes.json')
    }).map(
      (recipes) => {
        for (let recipe of recipes) {
          if (!recipe['ingredients']) {
            recipe['ingredients'] = [];
          }
        }
        return {
          type: RecipeActions.SET_RECIPES,
          payload: recipes
        };
      }
    );

  @Effect({dispatch: false})
  recipeStore = this.actions$.ofType(RecipeActions.STORE_RECIPES).withLatestFrom(
    this.store.select('recipes')
  ).switchMap(
    ([action, state]) => {
      return this.httpClient.put('https://recipe-book-dc232.firebaseio.com/recipes.json',
        state.recipes, {
          observe: 'body'
        });
    }
  );

  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private store: Store<fromRecipe.FeatureState>) {}
}
