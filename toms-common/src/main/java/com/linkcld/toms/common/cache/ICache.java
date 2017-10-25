package com.linkcld.toms.common.cache;

import java.util.List;

public interface ICache<T> {
	public <T> void put(String key, T value);

	public T get(String key);

	public boolean remove(String key);
	
	public void removeAll();

	public int getSize();

	public List<String> getKeys();

	public List<T> getList();

	public void flush();
}
