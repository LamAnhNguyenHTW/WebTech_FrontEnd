import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import axios from 'axios'
import LieferantenView from '../../views/LieferantView.vue'

describe('LieferantenViewMitRestData', () => {
  beforeEach(() => {
    vi.mock('axios')
    vi.spyOn(window, 'confirm').mockImplementation(() => true)
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('info anzeigen, wenn Datenbank leer ist', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [] })

    const wrapper = shallowMount(LieferantenView)
    await flushPromises()

    expect(wrapper.text()).toContain('Keine Lieferanten vorhanden')
    expect(wrapper.find('table').exists()).toBe(false)
  })

/*  it('API Error handeln', async () => {
    vi.mocked(axios, true).get.mockRejectedValueOnce(new Error('API Error'))

    const wrapper = shallowMount(LieferantenView)
    await flushPromises()

    expect(wrapper.text()).toContain('Keine Lieferanten vorhanden')
    expect(wrapper.find('table').exists()).toBe(false)
  })*/

  it('Lieferanten hinzufügen', async () => {
    const newSupplier = {
      name: 'New Supplier',
      address: 'New Address',
      phone: '999999',
      email: 'new@test.de',
      rating: 4
    }

    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [] })
    vi.mocked(axios, true).post.mockResolvedValueOnce({
      data: { id: 1, ...newSupplier }
    })

    const wrapper = shallowMount(LieferantenView)
    await flushPromises()


    await wrapper.find('.add-supplier-btn').trigger('click')


    await wrapper.find('#supplier-name').setValue(newSupplier.name)
    await wrapper.find('#supplier-address').setValue(newSupplier.address)
    await wrapper.find('#supplier-phone').setValue(newSupplier.phone)
    await wrapper.find('#supplier-email').setValue(newSupplier.email)
    await wrapper.find('#supplier-rating').setValue(newSupplier.rating)


    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(axios.post).toHaveBeenCalledWith(expect.any(String), newSupplier)
  })

  it('Rating-Bereich validieren von 1 bis 5', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [] })

    const wrapper = shallowMount(LieferantenView)
    await flushPromises()

    await wrapper.find('.add-supplier-btn').trigger('click')

    const ratingInput = wrapper.find('#supplier-rating')
    expect(ratingInput.attributes('min')).toBe('1')
    expect(ratingInput.attributes('max')).toBe('5')
  })

  it('Lieferanten löschen', async () => {
    const supplier = {
      id: 1,
      name: 'Test Supplier',
      address: 'Test Address',
      phone: '123456',
      email: 'test@test.de',
      rating: 4
    }

    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [supplier] })
    vi.mocked(axios, true).delete.mockResolvedValueOnce({})

    const wrapper = shallowMount(LieferantenView)
    await flushPromises()

    await wrapper.find('.delete-btn').trigger('click')
    await flushPromises()

    expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/1'))
  })

  it('Non-Array Daten handeln', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: { error: 'Invalid data' } })

    const wrapper = shallowMount(LieferantenView)
    await flushPromises()

    expect(wrapper.text()).toContain('Keine Lieferanten vorhanden')
    expect(wrapper.find('table').exists()).toBe(false)
  })
})
