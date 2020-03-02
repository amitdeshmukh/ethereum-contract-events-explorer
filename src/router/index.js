import Vue from 'vue'
import Router from 'vue-router'
import ContractEvents from '@/components/ContractEvents'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ContractEvents',
      component: ContractEvents
    }
  ]
})
