import { describe, it, expect, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import axios from 'axios'
import InventurView from '../../views/InventurView.vue'

describe('InventurViewMitRestData', () => {
  vi.mock('axios')

  it('info anzeigen, wenn Datenbank leer ist', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [] })

    const wrapper = shallowMount(InventurView)
    await flushPromises()

    expect(wrapper.text()).toContain('Keine Produkte im Lager gefunden')
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('Produktliste von Back-End laden', async () => {
    const twoProductsResponse = [
      { id: 1, name: 'Produkt A', quantity: 5, price: 10.00 },
      { id: 2, name: 'Produkt B', quantity: 3, price: 20.00 }
    ]

    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: twoProductsResponse })

    const wrapper = shallowMount(InventurView)
    await flushPromises()


    expect(wrapper.find('table').exists()).toBeTruthy()
    expect(wrapper.findAll('tbody tr')).toHaveLength(twoProductsResponse.length)


    expect(wrapper.text()).toContain('110.00 €')
  })

  it('API-Fehler erfolgreich handeln', async () => {
    vi.mocked(axios, true).get.mockRejectedValueOnce(new Error('API Error'))

    const wrapper = shallowMount(InventurView)
    await flushPromises()

    expect(wrapper.text()).toContain('Keine Produkte im Lager gefunden')
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('Gesamtpreis pro Produkt richtig berechnen', async () => {
    const singleProductResponse = [
      { id: 1, name: 'Produkt A', quantity: 5, price: 10.00 }
    ]

    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: singleProductResponse })

    const wrapper = shallowMount(InventurView)
    await flushPromises()

    const productValueCell = wrapper.findAll('td').at(3)
    expect(productValueCell?.text()).toContain('50.00 €')
  })

  it('Non-Array Antwort handeln', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: { error: 'Invalid data' } })

    const wrapper = shallowMount(InventurView)
    await flushPromises()

    expect(wrapper.text()).toContain('Keine Produkte im Lager gefunden')
    expect(wrapper.find('table').exists()).toBe(false)
  })
})
