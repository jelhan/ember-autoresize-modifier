import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @tracked value = '';

  @action
  inputChanged(event) {
    this.value = event.target.value;
  }
}
