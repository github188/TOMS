package com.linkcld.toms.common.cache.ehcache;

import com.linkcld.toms.common.cache.ICache;
import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


public class EhCacheCache implements ICache<Object> {
	private Cache ehcache = null;

	public EhCacheCache(Cache ehcache) {
		super();
		this.ehcache = ehcache;
	}

	@Override
	public <T>  void put(String key, T value) {
		if (ehcache != null) {
			Element e = new Element(key, value);
			ehcache.put(e);
		}
	}

	public Object get(String key) {
		if (ehcache != null) {
			Element element = ehcache.get(key);
			return element != null ? element.getObjectValue() : null;
		}
		return null;
	}
	@Override
	public void removeAll() {
		if (ehcache != null) {
			ehcache.removeAll();
		}
	}
	public void flush() {
		if (ehcache != null) {
			ehcache.flush();
		}
	}
	@Override
	public boolean remove(String key) {
		if (ehcache != null) {
			return ehcache.remove(key);
		}
		return false;
	}
	@Override
	public int getSize() {
		return ehcache.getSize();
	}
	public void removeAll(Collection<String> keys) {
		if (ehcache != null) {
			ehcache.removeAll(keys);
		}
	}
	public List<String> getKeys(){
		if (ehcache != null) {
			return ehcache.getKeys();
		}
		return null;
	}

	public List<Object> getList(){
		List<String> keys = this.getKeys();
		List<Object> list = new ArrayList<Object>();
		for (int i=0;i<keys.size();i++){
			list.add(this.get(keys.get(i)));
		}
		return list;
	}
}
