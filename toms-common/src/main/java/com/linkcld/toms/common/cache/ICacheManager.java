package com.linkcld.toms.common.cache;

import java.util.List;

public interface ICacheManager {
	public List<ICache> getAllCaches();

	public ICache getCache(String cacheName);

	public void shutdown();
}
